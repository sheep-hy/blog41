const {User} = require('../../model/user');
const hash = require('../../utils/hash');
module.exports = async (req, res, next) => {
    const {id} = req.query;
    const {password, username, email, role, state} = req.body; // 传过来的所有信息

    // 根据 id 查询当前用户的信息
    const user = await User.findOne({_id: id});
    // 判断用户传递过来的密码是否和查询出来的密码一致
    
    if(hash(password) === user.password) {
        // 如果一致则允许修改，又因为邮箱是唯一的，所以在修改的时候如果输入的新邮箱在数据库中已经存在的话就会抛出异常，需要捕获异常，并返回错误信息
        //使用try-catch捕获修改数据时新邮箱已经存在时抛出的异常
        try {
            // 修改操作
            await User.updateOne({_id:id},{
                username,
                email,
                // password,密码暂时不做修改功能
                role,
                state
            })
        } catch (error) {
            //捕获异常，返回错误信息
            return next(JSON.stringify({path:"/admin/user-edit",message:"此邮箱已经被注册，修改失败，请重新输入邮箱",id:id}));
        }
        //修改成功后重定向到用户列表页面
        return res.redirect("/admin/user");
    } else {
        // 否则不允许修改
        next(JSON.stringify({path: '/admin/user-edit', message: '密码不一致', id}));
    }
};
