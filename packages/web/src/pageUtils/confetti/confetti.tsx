import { rng } from './utils'
import { useEffect , useRef , useState } from 'react'
import { Confetto } from './confetto'

type ConfettiProps = {
    tick?:number ,
    velocity?:{ x:number , y:number , z:number } ,
    right?:boolean ,
    zAxisClamp?:number ,
}

type CannonProps = {
    delay?:number ,
    right?:boolean ,
}


// manage quantity, bounds, and offsets
export const Confetti:React.FC<ConfettiProps> = p => {
  const [{ quantity , xSpread , xOffset , ySpread , yOffset , zSpread , zOffset }] = useState( () => ({
    quantity: window.innerWidth/40 ,
    xSpread : window.innerWidth/6  ,
    xOffset : window.innerWidth/80 ,
    ySpread : window.innerHeight/7 ,
    yOffset : window.innerHeight/7 ,
    zSpread : 5 ,
    zOffset : 1 ,
  }))
  return !quantity ? <></> : (new Array(Math.round(quantity))).fill(1).map( () => {
    return <Confetto {...{
      ...p ,
      tick : 50 ,
      velocity : {
        x : rng(xOffset,xSpread) ,
        y : rng(yOffset,ySpread) ,
        z : rng(0,zSpread*10)/100 - zOffset ,
      }
    }} />
  })
}
export const useConfetti = () => {
  const [ key , setKey ] = useState(0)
  return [
    () => setKey(t=>t+1) ,
    ( p:ConfettiProps ) => !key ? <></> : <Confetti {...{...p,key}} />
  ] as [ ()=>void , React.FC<ConfettiProps>]
}

export const Cannon:React.FC<CannonProps> = ({ delay , ...p }) => {
  const [ trigger , Confetti ] = useConfetti()
  useEffect( () => { setTimeout( ()=>{
    if (trigger){
      trigger()
    }
  }, delay ) } , [] )
  return  <Confetti {...p} />
}

export const useCannons = ({ stagger=1000 , quantity=4 }) => {
  const [ [ , cannons] , setCannons ] = useState([ 0 , new Array(quantity).fill(undefined) ])
  const handleFire = () =>{
    setCannons( ([ count , cannons ]) => [
      count+quantity ,
      cannons.map( ( c , i ) =>
        <Cannon key={count*i} {...{ delay:stagger*i , right:i%2===0 }} />
      )
    ])
  }
  return  [ handleFire , cannons ]
}



// ///////
// //
// const [ handleFire , Cannons ] = useCannons({stagger:1000,quantity:4})
// <button onClick={handleFire}>fire</button>
// {Cannons}
// // 
// ///////

// ///////
// //
// const [ trigger2 , Cannon2 ] = useConfetti()
// <button onClick={()=>{trigger1();trigger2()}}>celebrate</button>
// <Cannon1 />
// <Cannon2 right/>
// //
// ///////
