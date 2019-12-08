import React, {useState, useEffect, useRef} from 'react';
import './bullet-traject.scss';

const getBulletTrajectClassName = (idleState) => {
  const initClass = 'bullet-traject-init';
  if (idleState) {
    return initClass;
  } else {
    return initClass + ' bullet-traject-fire';
  }
}

const BulletTraject = (props) => {
  // 0, idle
  // 1, during cooldown
  let [bulletTrajectState, setBulletTrajectState] = useState({idle: true});
  const bulletRef = useRef(null);
  useEffect(() => {
    if (bulletTrajectState.idle && bulletRef.current) {
      setBulletTrajectState(prevState => {
        return { ...prevState, idle: false}
      });
      setTimeout(() => {
        setBulletTrajectState(prevState => {
          return { ...prevState, idle: true}
        });
      }, 1000);
    }
  }, [props.fire]);
  const bulletTrajectClasses = getBulletTrajectClassName(bulletTrajectState.idle);
  return (<div className='bullet-traject-container'>
    <div className={bulletTrajectClasses} ref={bulletRef}></div>
  </div>);
}

export default BulletTraject;
