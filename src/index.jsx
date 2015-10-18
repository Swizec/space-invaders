import React from 'react';
import SpaceInvaders from './components/SpaceInvaders';

React.render(<SpaceInvaders width={640}
                            height={480}
                            initialEnemies={70} />, document.getElementById('root'));
