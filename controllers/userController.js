import User from "../models/User.js";
import IdGenerator from "../helpers/IdGenerator.js";
import JWTGenerate from "../helpers/JWTGenerator.js";
import { emailRegister, emailForgotPassword } from "../helpers/email.js";

//CREATION
const registerUser = async (req, res) => {
  //Evitar duplicidad
  const { email } = req.body;
  const userExist = await User.findOne({ email: email });

  if (userExist) {
    const error = new Error("User Already Registered!");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body); // Viene (body-datos) del Formulario en el frontend
    user.token = IdGenerator();
    // const userSaved = await user.save(); // Solo para recordar si quiero retornar el obj creado
    await user.save();
    //Enviar el email de confirmacion
    emailRegister({
      name: user.name,
      email: user.email,
      token: user.token,
    });
    res.json({
      msg: "User Created Successfully, check your email",
    });
  } catch (error) {
    console.log(error);
  }
};

//AUTHENTICATION
const authenticate = async (req, res) => {
  //Destructurar user
  const { email, password } = req.body;

  //Comprobar user Existe?
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = new Error(`User doesn't Exist`);
    return res.status(404).json({ msg: error.message });
  }

  //Comprobar user Esta confirmado?
  if (!user.confirmUser) {
    const error = new Error("Unconfirmed Accound");
    return res.status(403).json({ msg: error.message });
  }

  //Comprobar user El password
  //Como se creo el methodo en el Modelo tenemos acceso a el desde aca
  if (await user.checkPassword(password)) {
    // password => es que requerimos desde el body
    console.log("Correct");
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email, //? depronto no almacenar email
      token: JWTGenerate(user._id),
    });
  } else {
    const error = new Error("Password Incorrect");
    return res.status(403).json({ msg: error.message });
  }
};

//Confirm
const confirm = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });

  if (!userConfirm) {
    const error = new Error("Invalid Token");
    return res.status(403).json({ msg: error.message });
  }
  try {
    userConfirm.confirmUser = true;
    userConfirm.token = "";
    await userConfirm.save();
    res.json({ msg: "User Confirmed Successfully" });
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  //Comprobar si user exist
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = new Error(`User doesn't Exist`);
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = IdGenerator();
    await user.save();

    //ENVIA EL EMAIL DE RECUPERACION
    emailForgotPassword({
      name: user.name,
      email: user.email,
      token: user.token,
    });
    res.json({ msg: `We've sent an email with the instructions` });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req, res) => {
  const { token } = req.params;

  const tokenValid = await User.findOne({ token });

  if (tokenValid) {
    res.json({ msg: `Token Valido User Exist` });
  } else {
    const error = new Error(`Invalid Token!!`);
    return res.status(404).json({ msg: error.message });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Comprobar si el token es valido
  const user = await User.findOne({ token });

  if (user) {
    user.password = password;
    user.token = "";
    user.confirmUser = true;
    try {
      await user.save();
      res.json({ msg: "Password Changed!" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error(`Invalid Token!!!`);
    return res.status(404).json({ msg: error.message });
  }
};

const profile = async (req, res) => {
  const { user } = req;
  res.json(user);
};

export {
  registerUser,
  authenticate,
  confirm,
  forgotPassword,
  checkToken,
  newPassword,
  profile,
};
