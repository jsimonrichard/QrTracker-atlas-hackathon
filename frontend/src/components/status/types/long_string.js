import { TextArea } from "../../form";

export default class LongString {
  static NAME = "Text Box";
  
  static setterComponent(props) {
    return (
      <TextArea {...props}/>
    );
  }

  static getterComponent({value}) {
    return (
      <p>
        {value}
      </p>
    );
  }
}