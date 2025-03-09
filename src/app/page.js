"use client"

import React from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app';

import firebaseConfig from '../../firebase'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app);

const Page = () => {

  const [ foods, setFoods ] = useState([])

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

  const incremenet = (id, currentCount) => {
    console.log("Incrementing - ID:", id, "Count:", currentCount);
    updateCount(id, currentCount + 1);
  }

  const decrement = (id, currentCount) => {
    console.log("Incrementing - ID:", id, "Count:", currentCount);

    { currentCount > 0 ?
      (updateCount(id, currentCount - 1))
      : null
    }
  }

  return (
    <main>
      <h1>Pantry Tracker</h1>
      <ul>
        {foods.map((item, index) => (
          <li key={index}>{item.name}: {item.count}
            <button onClick={() => incremenet(item.id, item.count)}>+</button>
            <button onClick={() => decrement(item.id, item.count)}>-</button>
          </li>

        ))      
      }


      </ul>
      
    </main>
  )
}

export default Page

