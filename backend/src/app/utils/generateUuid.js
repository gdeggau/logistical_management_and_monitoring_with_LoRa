import { v4 as uuidv4 } from "uuid";

export default function generateUuid(model) {
  model.addHook("beforeCreate", async (modelObject) => {
    modelObject.id = uuidv4();
    console.log(`AQUIIIIIIII ${modelObject.id}`);
  });
}
