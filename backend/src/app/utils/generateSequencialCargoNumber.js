import Cargo from "../models/Cargo";
import cargoNumberConfig from "../../config/cargoNumber";

function pad_with_zeroes(number, length = cargoNumberConfig.numberLength) {
  var my_string = "" + number;
  while (my_string.length < length) {
    my_string = "0" + my_string;
  }

  return cargoNumberConfig.initialCharacter + my_string;
}

export default async function generateSequencialCargoNumber(model) {
  var lastCargoNumber = await Cargo.findOne({
    attributes: ["cargo_number"],
    order: [["cargo_number", "DESC"]],
  });
  if (!lastCargoNumber) {
    lastCargoNumber = pad_with_zeroes(1);
    return lastCargoNumber;
  }

  const newCargoNumber = parseInt(lastCargoNumber.cargo_number.substr(1)) + 1;
  return pad_with_zeroes(newCargoNumber);
}
