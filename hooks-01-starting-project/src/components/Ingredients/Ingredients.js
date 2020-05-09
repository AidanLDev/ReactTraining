import React, { useReducer, useCallback, useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

// Using a reducer is clear because all the state logic is in one place
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredients];
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error('No Ingredients action');
  }
};

const Ingredients = () => {
  const [ingredients, dispatchIng] = useReducer(ingredientReducer, []); //  Initial value of ingredients is an empty array
  const {
    loading,
    error,
    data,
    sendReq,
    reqExtra,
    identifier,
    clear,
  } = useHttp();

  useEffect(() => {
    if (!loading && identifier === 'REMOVE_INGREDIENT') {
      dispatchIng({ type: 'DELETE', id: reqExtra });
    } else if (!loading && !error && identifier === 'ADD_INGREDIENT') {
      dispatchIng({
        type: 'ADD',
        ingredients: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, identifier, loading, error]);

  const handleAddIngredient = useCallback(
    (ingredient) => {
      sendReq(
        'https://aidan-react-hooks.firebaseio.com/ingredients.json',
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'ADD_INGREDIENT'
      );
    },
    [sendReq]
  );

  const handleRemoveIngredient = useCallback(
    (ingredientId) => {
      sendReq(
        `https://aidan-react-hooks.firebaseio.com/ingredients/${ingredientId}.json`,
        'DELETE',
        null,
        ingredientId,
        'REMOVE_INGREDIENT'
      );
    },
    [sendReq]
  );

  const handleFilterIngredients = useCallback((filteredIngredients) => {
    dispatchIng({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={handleRemoveIngredient}
      />
    );
  }, [ingredients, handleRemoveIngredient]);

  return (
    <div className='App'>
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={handleAddIngredient} loading={loading} />
      {ingredientList}
      <section>
        <Search handleFilterIngredients={handleFilterIngredients} />
      </section>
    </div>
  );
};

export default Ingredients;
