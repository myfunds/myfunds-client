import glamorous from 'glamorous';

const Select = glamorous.select({
  // fontSize: '24px',
  // textAlign: 'center',
  // margin: '12px auto',
  // display: 'block',
  // border: '1px solid #d1d1d1',
  backgroundColor: '#fff',
  // padding: '12px',
  appearance: 'none',

  display: 'flex',
  flex: '1 1 auto',
  alignSelf: 'stretch',
  margin: '12px auto',
  textAlign: 'center',
  border: '0',
  boxShadow: '0px 2px 10px -2px rgba(0, 0, 0, 0.5)',
  borderRadius: '4px',
  padding: '6px 18px',
  fontSize: '24px',
  lineHeight: '30px',
  backgroundImage: `
    linear-gradient(60deg, transparent 50%, black 50%),
    linear-gradient(120deg, black 60%, transparent 50%),
    linear-gradient(to right, white, white)`,
  backgroundPosition: `
    calc(100% - 20px) calc(1em + -5px),
    calc(100% - 15px) calc(1em + -5px),
    100% 0`,
  backgroundSize: `
    5px 10px,
    5px 10px,
    1.5em 2.5em`,
  backgroundRepeat: 'no-repeat',

  // '::after': {
  //   content: '"\\f095"',
  //   fontFamily: 'FontAwesome',
  //   left: '-5px',
  //   position: 'absolute',
  //   top: '0',
  // }
});

export default Select;
