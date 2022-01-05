function abstract() {
  throw new Error("Called abstract type's function (must be overriden)");
}


export default class AbstractType {
  static NAME = "";
  static setterComponent({}) { abstract() }
  static getterComponent({}) { abstract() }
  static getterVerboseComponent({}) { abstract() }
}