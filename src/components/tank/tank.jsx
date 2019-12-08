import React, {useState, useEffect} from 'react';
import GunFire from './gun-fire';
import BulletTraject from './bullet-traject';
import './tank.scss';
const moveStep = 0.1; //em
const rotateStep = 1; //deg

const convertDegToPI = deg => Math.round(deg*Math.PI*1000/180)/1000;

const calculateCoordinate = (moveLength, theta) => {
  const thetaPI = convertDegToPI(theta);
  // thetaPI = 0,     moveLength=1, y=1, x=0
  // thetaPI = PI/2,  moveLength=1, y=0, x=1
  // thetaPI = PI,    moveLength=1, y=-1, x=0
  // thetaPI = 2/3*PI,moveLength=1, y=0, x=-1
  const x = Math.round(10000*moveLength*Math.sin(thetaPI))/10000;
  const y = Math.round(10000*moveLength*Math.cos(thetaPI))/10000;
  return {x, y};
}
const Tank = ({name='T1', x=10, y=10, t=360, fire=0}) => {
  let [tankState, setTankState] = useState({x, y, t, fire});
  const keyDownHandler = (evt) => {
    switch (evt.key) {
      case 'w':
      {
        setTankState(prevState => {
          const move = calculateCoordinate(moveStep, prevState.t);
          return { ...prevState, x: prevState.x+move.x, y: prevState.y-move.y }
        });
        break;
      }
      case 's':
      {
        setTankState(prevState => {
          const move = calculateCoordinate(-moveStep, prevState.t);
          return { ...prevState, x: prevState.x+move.x, y: prevState.y-move.y }
        });
        break; 
      }
      case 'a':
      {
        setTankState(prevState => {
          return { ...prevState, t: (prevState.t-rotateStep)%360 }
        });
        break;
      }
      case 'd':
      {
        setTankState(prevState => {
          return { ...prevState, t: (prevState.t+rotateStep)%360 }
        });
        break; 
      }
      case ' ': {
        // should fire
        setTankState(prevState => {
          return { ...prevState, fire: {trigger: true} }
        });
      }
      default:
        break;
    }
  }
  
  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler, true);
  }, []);
  let mainStyle = {
    left: `${tankState.x}em`,
    top: `${tankState.y}em`
  }
  let rotateStyle = {
    transform: `rotate(${tankState.t}deg)`
  }
  return (
    <div className='tank-main' style={mainStyle}>
      <div className="tank-container" style={rotateStyle}>
        <div className="tank">
          <div className="tank-gun">
          </div>
          <div className="tank-gun-fire">
            <GunFire fire={tankState.fire}/>
            <BulletTraject fire={tankState.fire}/>
          </div>
        </div>
      </div>
      <div className='tank-label'>{name}</div>
    </div>
  );
}

export default Tank;