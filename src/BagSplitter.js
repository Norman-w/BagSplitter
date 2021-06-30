import React, {Component} from 'react';
import classNames from './BagSplitter.module.css';
import BagItemsShower from "./BagItemsShower";
import Swal2 from "sweetalert2";
class BagSplitter extends Component {
    state={
        hoverConfirmBtn:false
    }
    constructor(props) {
        super(props);
        document.body.style='background-color:black';
    }
    //当用户点击保存编辑的时候.
    onClickConfirmBtn()
    {
        if (!this.bagsItems || this.bagsItems.length!==2)
        {
            console.error('无效的包裹内商品的数据');
            return;
        }
        let src = this.bagsItems[0];
        let dest = this.bagsItems[1];
        if (!src || !dest || src.length<1 || dest.length<1)
        {
            console.error("有包裹是空的哟");
            const Toast = Swal2.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal2.stopTimer)
                    toast.addEventListener('mouseleave', Swal2.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'error',
                title: '请检查一下,每一个包裹中,都要有商品哦'
            })

            // Swal2.mixin(
            //     {
            //         toast:true,
            //         title:'有包裹是空的哟',
            //         position: "top-end",
            //         timer:2000,
            //         timerProgressBar:true,
            //
            //     }
            // )
            return;
        }
        if (this.props.onClickConfirmBtn)
        {
            this.props.onClickConfirmBtn();
        }
    }
    bagsItems=[[],[]]
    onItemsChanged(bagsItems)
    {
        //固定给两个包裹的信息
        this.bagsItems = bagsItems;
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
                <BagItemsShower sourceBag={bag1} onItemsChanged={this.onItemsChanged.bind(this)}/>
                <div className={this.state.hoverConfirmBtn?classNames.saveBtnHover:classNames.saveBtn}
                     onMouseEnter={()=>this.setState({hoverConfirmBtn:true})}
                     onMouseLeave={()=>this.setState({hoverConfirmBtn:false})}
                     onClick={this.onClickConfirmBtn.bind(this)}
                >
                    <div className={classNames.saveBtnText}>确</div>
                    <div className={classNames.saveBtnText}>认</div>
                </div>
            </div>
        );
    }
}

export default BagSplitter;