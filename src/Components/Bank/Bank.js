import React, {Component} from 'react';
import DrawBtn from '../DrawBtn/DrawBtn';
import './Bank.css';

const Bank = ({currBank, drawTile, isWinnerOrSecondPlace}) => {
    return (
        <React.Fragment>
            <div className="bank">
                <div className="bank-item">
                    <h2>{currBank.length} Tiles left in the bank</h2>
                </div>
            </div>
            {
                !isWinnerOrSecondPlace?
                <div className='bank'>
                    <div className='bank-item'>
                        <DrawBtn drawTile={drawTile}/>
                    </div>
                </div>
                : null
            }

        </React.Fragment>
    );
}

export default Bank;