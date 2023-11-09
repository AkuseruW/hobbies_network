import React from 'react';

const BannedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Accès Refusé</h1>
        <p className="text-gray-700 mb-4">
          Désolé, vous êtes banni de cette page. Veuillez contacter l'administrateur pour plus d'informations.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-600">
          Contacter l'administrateur
        </button>
      </div>
    </div>
  );
};

export default BannedPage;
