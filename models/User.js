import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Por favor, forneça um nome"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Por favor, forneça um email"],
    unique: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Por favor, insira um endereço de email válido.",
    },
  },
  password: {
    type: String,
    required: [true, "Por favor, forneça uma senha"],
    minlength: [8, "A senha deve ter pelo menos 8 caracteres"],
    select: false, // nao incluir passwords nos pedidos
  },
  location: {
    type: String,
    default: "Lisboa",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profilePicture: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
});

// Hashear pass antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Comparar passwords
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
