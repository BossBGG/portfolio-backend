const password = ""; 

const hash = await Bun.password.hash(password, {
  algorithm: "argon2id",
  memoryCost: 65536,
  timeCost: 3
});

console.log(hash);
