// 路由
const Router = require('koa-router')
const router = new Router()
// 校验
const {validate} = require("../middlewares/validation");
const { updatePasswordSchema , deleteAccountSchema} = require("../schema/userSchema");
// 加密
const bcrypt = require('bcrypt')
// 数据库
const { User, VerificationCode, Sequelize, sequelize } = require("../models");
// 返回函数
const {successResponse, failureResponse} = require("../until/responseData");
// 时间方法
const { Op } = Sequelize
// 认证
const authMiddleware = require("../middlewares/auth");

// 根据用户ID获取用户信息接口
router.get('/getUserInfo', authMiddleware, async (ctx) => {
  try {
    const userId = ctx.state.user.userId;

    const userInfo = await User.findAll({
      where: {
        user_id: userId
      },
      attributes: { exclude: ['password'] }
    })

    if (!userInfo) {
      ctx.status = 404;
      ctx.body = failureResponse('User not found');
      return;
    }

    ctx.body = successResponse('User information fetched successfully', userInfo);
  } catch (e) {
    ctx.status = 500;
    ctx.body = failureResponse('An error occurred while fetching the User entries.')
  }
})

// 修改用户信息接口
router.put('/updateUserInfo', authMiddleware, async (ctx) => {
  try {
    const userId = ctx.state.user.userId;
    const { username, role, gender, subscription, avatar } = ctx.request.body;

    // 查找用户
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      ctx.status = 404;
      ctx.body = failureResponse('User not found');
      return;
    }

    // 更新用户信息
    await user.update({
      username: username || user.username,
      password: password || user.password,
      role: role || user.role,
      gender: gender || user.gender,
      subscription: subscription || user.subscription,
      avatar: avatar || user.avatar
    });

    ctx.body = successResponse('User information updated successfully');
  } catch (e) {
    console.error('Error updating user information:', e);
    ctx.status = 500;
    ctx.body = failureResponse('An error occurred while updating the user information.');
  }
});

// 修改密码接口
router.put('/updatePassword', authMiddleware, validate(updatePasswordSchema), async(ctx) => {
  const { code, password } = ctx.request.validatedBody;

  // 开始事务
  const transaction = await sequelize.transaction();

  try {
    const userId = ctx.state.user.userId;

    // 查找用户
    const user = await User.findOne({ where: { user_id: userId }, transaction });

    if (!user) {
      ctx.status = 404;
      ctx.body = failureResponse('User not found');
      return;
    }

    // 验证验证码
    const verification = await VerificationCode.findOne({
      where: {
        email: user.email,
        code,
        expires_at: {
          [Op.gt]: new Date() // 验证码尚未过期
        }
      },
      order: [['created_at', 'DESC']],
      transaction
    });

    console.log(verification, 'verification')
    if (!verification) {
      ctx.status = 400;
      ctx.body = failureResponse('Invalid or expired verification code', {}, 400)
      await transaction.rollback();
      return;
    }

    // 加密密码并修改密码
    const hashedPassword = await bcrypt.hash(password, 10);
    // 更新用户信息
    await user.update({
      password: hashedPassword,
    }, { transaction });

    // 提交事务
    await transaction.commit()

    ctx.body = successResponse('Password updated successfully')
  } catch (error) {
    // 如果发生错误，回滚事务
    await transaction.rollback()

    ctx.status = 500; // 服务器错误
    ctx.body = failureResponse('An error occurred while updating the password');
  }
})

// 删除账号接口
router.delete('/deleteAccount', authMiddleware, validate(deleteAccountSchema), async (ctx) => {
  const userId = ctx.state.user.userId;
  const { code } = ctx.request.validatedBody;

  // 开始事务
  const transaction = await sequelize.transaction();

  try {
    // 查找用户
    const user = await User.findOne({ where: { user_id: userId }, transaction });

    if (!user) {
      ctx.status = 404;
      ctx.body = failureResponse('User not found');
      await transaction.rollback();
      return;
    }

    // 验证验证码
    const verification = await VerificationCode.findOne({
      where: {
        email: user.email,
        code,
        expires_at: {
          [Op.gt]: new Date() // 验证码尚未过期
        }
      },
      order: [['created_at', 'DESC']],
      transaction
    });

    // if (!verification) {
    //   ctx.status = 400;
    //   ctx.body = failureResponse('Invalid or expired verification code');
    //   await transaction.rollback();
    //   return;
    // }

    // 删除用户和相关数据
    await User.destroy({ where: { user_id: userId }, transaction });

    // 提交事务
    await transaction.commit();

    ctx.body = successResponse('Account deleted successfully');
  } catch (error) {
    // 如果发生错误，回滚事务
    await transaction.rollback();

    ctx.status = 500;
    ctx.body = failureResponse('An error occurred while deleting the account');
  }
});

module.exports = router;





