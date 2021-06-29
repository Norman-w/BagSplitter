import React, {Component} from 'react';
import classNames from './Item.module.css'
class Item extends Component {
    render() {
        let item = this.props.item;
        return (
            <div
                className={classNames.item}
            >
                <div className={classNames.itemLeft}>
                    <img hidden={!item.PicPath} mode="aspectFill" className={classNames.itemImg} src={item.PicPath}/>
                    <img hidden={item.PicPath} mode="aspectFill" className={classNames.itemImg} src="https://www.enni.group/p/upload/0/red.jpg"/>
                </div>
                <div className={classNames.itemCenter}>
                    <div className={classNames.itemCenterTop}>
                        <div className={classNames.itemId}>商品编码:
                            <div>{item.ItemId}</div>
                        </div>
                    </div>
                    <div className={classNames.itemCenterBottom}>{item.Name}</div>
                </div>
                <div className={classNames.itemRight}>
                    <div className={classNames.itemPrice}>💰{item.Price}</div>
                    <div className={classNames.itemCount}>
                        <div>x</div>
                        <div>{item.Count}</div>
                    </div>
                </div>

            </div>
        );
    }
}

export default Item;