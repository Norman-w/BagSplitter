import React, {Component} from 'react';
import classNames from './BagItemsShower.module.css'
import ItemsDND from "./ItemsDND";

class BagItemsShower extends Component {

    render() {
        return (
            <div className={classNames.main}>
                <div className={classNames.items}>
                    <ItemsDND sourceBag={this.props.sourceBag}/>
                </div>
            </div>
        );
    }
}

export default BagItemsShower;