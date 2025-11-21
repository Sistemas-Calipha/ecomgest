import jwt from "jsonwebtoken";

const token = jwt.sign(
  {
    id: "729eeabf-6d91-42c7-a4ce-18d367f06fd5",
    correo: "admin@calipha.com",
    rol: "admin",
    empresa_id: "0868171e-a0ac-4739-afcb-9c5ef1dbd26f"
  },
  "3000",
  { expiresIn: "24h" }
);

console.log("\nTOKEN NUEVO LIMPIO:\n");
console.log(token);
console.log("\n-----------------------------");
