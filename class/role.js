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
      try {
      const userParams = req.body;
      const applyRole = new role(userParams.role, userParams.permissions);
      const createRole = await role.createRoleOnDatabase(applyRole);
      res.status(200);
      res.send('Created role on database :' + createRole);
      } catch(error) {
        res.status(500).send("500 - internal server error");
      }
  }

        constructor(role, permissions = []) {
          this._role = role;
          this._permissions = permissions;
        }
}
