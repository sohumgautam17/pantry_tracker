"use client"

import React from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app';
import WebcamCapture from './food_detection/capture';
import { analyzeImage } from './food_detection/vision_service';

import firebaseConfig from '../../firebase'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app);

const Page = () => {

  const [ foods, setFoods ] = useState([]);
  const [ imageSrc, setImageSrc ] = useState(null);
  const [ guessFood, setGuessFood ] = useState('');

  const get_data = async () => {
    const foodsRef = collection(db, 'pantry');
    const foodsSnapshot = await getDocs(foodsRef);
    const foods = foodsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return foods;
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await get_data();
      setFoods(data);
    }
    fetchData();
  }, []);  

  useEffect(() => {
    if (imageSrc) {
      getResponse(imageSrc)
    }
  }, [imageSrc]);

  const updateCount = async (id, newCount) => {
    try {
      const foodsRef = doc(db, 'pantry', id);
      await updateDoc(foodsRef, {'count': newCount});

      setFoods(foods.map((food) => (
        food.id === id ? {...food, count: newCount} : food
      )))

    } catch (error) {
      console.log(error)
    }
  } 

  const increment = (id, currentCount) => {
    console.log("Incrementing - ID:", id, "Count:", currentCount);
    updateCount(id, currentCount + 1);
  }

  const decrement = (id, currentCount) => {
    console.log("Decrementing - ID:", id, "Count:", currentCount);

    { currentCount > 0 ?
      (updateCount(id, currentCount - 1))
      : null
    }
  }

  const getResponse = async (imageSrc) => {
    const response = await analyzeImage(imageSrc);
    setGuessFood(response)
  }


  return (
    <main className='bg-black'>
      <h1 className='text-white text-4xl font-helvetica '>Pantry Tracker</h1>

      <WebcamCapture imageSrc={imageSrc} setImageSrc={setImageSrc} />
      {imageSrc ? console.log(imageSrc) : console.log("Image is not there")}

      <p>The food in the image is: {guessFood}</p>

      <ul>
        {foods.map((item, index) => (
          <li key={index}>{item.name}: {item.count}
            <button onClick={() => increment(item.id, item.count)}>+</button>
            <button onClick={() => decrement(item.id, item.count)}>-</button>
          </li>

        ))      
      }
      </ul>
      
    </main>
  )
}

export default Page

