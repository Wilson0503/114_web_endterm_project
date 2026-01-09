import React, { createContext, useContext, useState } from 'react';

const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);

  const addFood = (food) => {
    setFoods([food, ...foods]);
  };

  const updateFood = (id, updatedFood) => {
    setFoods(foods.map(f => f._id === id ? updatedFood : f));
  };

  const removeFood = (id) => {
    setFoods(foods.filter(f => f._id !== id));
  };

  return (
    <FoodContext.Provider value={{ foods, setFoods, selectedFood, setSelectedFood, addFood, updateFood, removeFood }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFood 必須在 FoodProvider 內使用');
  }
  return context;
};
