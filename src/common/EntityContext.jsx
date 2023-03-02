import React from 'react';

const EntityContext = React.createContext({
  entities: [],
  status: 'idle',
});

export default EntityContext;
