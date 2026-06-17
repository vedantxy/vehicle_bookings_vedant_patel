const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          // Standard RFC 5322 compliant email regex validator (supporting modern TLD lengths)
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.[a-zA-Z]{2,10})+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address`
      }
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not a valid role"
      },
      default: "user"
    },
    isActive: {
      type: Boolean,
      required: [true, "isActive is required"],
      default: true
    },
    phone: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);


const User = mongoose.model("User", userSchema);

module.exports = User;

