import mongoose from "mongoose";

export class role {

    static roleSchema = new mongoose.Schema({
        role: String,
        permissions: [{ type: String }],
      })

    static async createRoleOnDatabase(role) {
        await mongoose.connect(process.env.MONGO_ADDRESS);
    
        const pushRole = mongoose.model("role",this.roleSchema);
        const sendUser = new pushRole({
            role:role._role,
            permissions: role._permissions
        });
        await sendUser.save();
        return "ok";
    }

    static async callbackCreateRole(req,res) {
      //const userParams = req.body;
      const applyRole = new role("admin", ["canUpdateUser","canDeleteUser"])
      const createRole = await role.createRoleOnDatabase(applyRole);
      res.status(200);
      res.send('Created role on database :' + createRole);
  }

        constructor(role, permissions = []) {
          this._role = role;
          this._permissions = permissions;
        }
}
