  import React, { useState } from "react";


  import Wrapper from "./components/Wrapper";
  import Screen from "./components/Screen";
  import ButtonBox from "./components/ButtonBox";
  import Button from "./components/Button";

  const btnValues = [
    ["%", "/", "X", "Del"],
    [7, 8, 9, "-"],
    [4, 5, 6, "+"],
    [1, 2, 3, "+/-"],
    [0, ".", "="],
    
  ];

  const toLocaleString = (num) => {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
  };

  const removeSpaces = (num) => num.toString().replace(/\s/g, "");

  const math = (a, b, sign) =>
    sign === "+" ? a + b : sign === "-" ? a - b : sign === "X" ? a * b : a / b;

  const zeroDivisionError = "Can't divide with 0";

  const BackspaceButton = ({ onClick }) => (
    <Button value="" onClick={onClick} />
  );



  const App = () => {
    let [calc, setCalc] = useState({
      sign: "",
      num: 0,
      res: 0,
    });


    const backspaceClickHandler = () => {
      const numWithoutSpaces = removeSpaces(calc.num);
      const updatedNum = toLocaleString(numWithoutSpaces.slice(0, -1));
      setCalc({
        ...calc,
        num: updatedNum === "0" ? 0 : updatedNum,
        res: 0,
      });
    };



    const numClickHandler = (e) => {
      e.preventDefault();

      const value = e.target.innerHTML;

      if (removeSpaces(calc.num).length < 16) {
        if (removeSpaces(calc.num) % 1 === 0 && !calc.num.toString().includes(".")) {
          setCalc({
            ...calc,
            num: toLocaleString(Number(removeSpaces(calc.num + value))),
            res: !calc.sign ? 0 : calc.res, 
          });
        } else {
          setCalc({
            ...calc,
            num: toLocaleString(calc.num + value),
            res: !calc.sign ? 0 : calc.res, 
          });
        }
      }
    };


    const comaClickHandler = (e) => {
      e.preventDefault();

      const value = e.target.innerHTML;
      if (!calc.num.toString().includes(".")) {
        setCalc({
          ...calc,
          num: calc.num + value,
        });
      }
    };
    

    const signClickHandler = (e) => {
      const operator = e.target.innerHTML;
      setCalc({
        ...calc,
        sign: operator, 
        num: 0, 
        res: !calc.num
          ? calc.res 
          : !calc.res
            ? calc.num 
            : toLocaleString(
              math(
                Number(removeSpaces(calc.res)),
                Number(removeSpaces(calc.num)),
                calc.sign
              )
            ),
      });
    };
    

    const equalsClickHandler = () => {
      if (calc.sign && calc.num) {
        setCalc({
          ...calc,
          res:
            calc.num === "0" && calc.sign === "/"
              ? zeroDivisionError
              : toLocaleString(
                  math(
                    Number(removeSpaces(calc.res)),
                    Number(removeSpaces(calc.num)),
                    calc.sign
                  )
                ),
          sign: "", 
          num: 0, 
        });
      }
    };
    

    const invertClickHandler = () => {
      setCalc({
        ...calc,
        num: calc.num
          ? toLocaleString(removeSpaces(calc.num) * -1) 
          : 0, 
        res: calc.res
          ? toLocaleString(removeSpaces(calc.res) * -1) 
          : 0, 
        sign: "", 
      });
    };
    

    const percentClickHandler = () => {
      let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
      let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
      setCalc({
        ...calc,
        num: (num * 10 ** 16 / 10 ** 18), 
        res: (res * 10 ** 16 / 10 ** 18), 
        sign: "", 
      });
    };
    

    
    const buttonClickHandler = (e, btn) => {
      if (btn === "Del") {
        backspaceClickHandler(); 
      } else if (btn === "+/-") {
        invertClickHandler(); 
      } else if (btn === "%") {
        percentClickHandler(); 
      } else if (btn === "=") {
        equalsClickHandler(); 
      } else if (["/", "X", "-", "+"].includes(btn)) {
        signClickHandler(e); 
      } else if (btn === ".") {
        comaClickHandler(e); 
      } else {
        numClickHandler(e); 
      }
    };
    

    return (
      <Wrapper>
        <Screen value={calc.num ? calc.num : calc.res} />
        <ButtonBox>
          {btnValues.flat().map((btn, i) => {
            return (
              <Button
                key={i}
                className={btn === "=" ? "equals" : ""}
                value={btn}
                onClick={(e) => buttonClickHandler(e, btn)}
              />
            );
          })}
          <BackspaceButton onClick={backspaceClickHandler} />
        </ButtonBox>
      </Wrapper>
    );
  };

  export default App;
