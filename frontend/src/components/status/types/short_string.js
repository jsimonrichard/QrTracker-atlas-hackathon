import { TextInput } from '../../form';

export default class ShortString {
  static NAME = "Text";
  
  static setterComponent(...props) {
    return (
      <TextInput {...props}/>
    );
  }

  static getterComponent({value}) {
    return (
      <div>
        {value}
      </div>
    );
  }
}