import React, {Component} from 'react';
import classNames from './BagSplitter.module.css';
import BagItemsShower from "./BagItemsShower";
class BagSplitter extends Component {
    constructor(props) {
        super(props);
        document.body.style='background-color:black';
    }
    render() {
        let bag1 = {
            Pid:1111111,
            Items:
                [
                    {
                        ItemId:10001,
                        Name:'测试商品名字1',
                        Count:3,
                        PicPath:'http://pic.enni.group/upload/8801051065602/130x130/3c1397f3-a647-48f9-87fc-dc637f30bbff.jpg',
                        Price:15
                    },
                    {
                        ItemId:10002,
                        Name:'测试商品名字2',
                        Count:4,
                        PicPath:'http://pic.enni.group/upload/8801051065602/130x130/3c1397f3-a647-48f9-87fc-dc637f30bbff.jpg',
                        Price:18
                    },
                    {
                        ItemId:10003,
                        Name:'测试商品名字3',
                        Count:9,
                        PicPath:'http://pic.enni.group/upload/8801051065602/130x130/3c1397f3-a647-48f9-87fc-dc637f30bbff.jpg',
                        Price:12.12
                    }
                ]
        };
        let bag2 = {
            Pid:0,
            Items:[],
        }
        return (
            <div className={classNames.main}>
                <BagItemsShower sourceBag={bag1}/>
                {/*<BagItemsShower bag={bag2}/>*/}
            </div>
        );
    }
}

export default BagSplitter;