import mongoose from "mongoose";
import bcrypt from "bcrypt"; // se utiliza middleware y hooks - pre- https://mongoosejs.com/docs/middleware.html
// para ejecutar codigo antes y desps de que almacene
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirmUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Crea dos columnas mas Creado- Actualizado
);

// Se ejecuta antes de guardar en DB
userSchema.pre("save", async function (next) {
  //revisa que el password no haya sido cambiado
  // el pre save hashea sobre el hash actual -> el usuario perderia el aceso
  //si no se modifica el password lo deja quieto
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // hace referencia al objeto ususario en userController
});

//Comprobar Password
//Funcion para comprobar el password de manera custom
userSchema.methods.checkPassword = async function (passwordform) { // password que viene desde el form
  return await bcrypt.compare(passwordform, this.password); // compara el que user escribe, contra el que existe hasheado
};

const User = mongoose.model("User", userSchema);
export default User;
