import React, {Component} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import classNames from './ItemsDND.module.css';
import Swal2 from 'sweetalert2';
import Item from "./Item";

//region 全局数据

//region 样式,一个单位的占位宽度基础是多少.根据这个数值可以设置页面的外边框等边距样式
//endregion
//endregion

const srcBagItemsListName='srcBagItemsList';
const destBagItemsListName = 'destBagItemsList';

//region 全局方法

//region 获取guid
const getGuid = () => {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}
//endregion

//region 视图数据到枚举list数据的转换.枚举list用于数据存储
const convert2EnumIndexList = (showingItems)=>
{

}
//endregion

//region 初始化数据

const getItems3 = (bagItems) => {
    if (!bagItems)
        return null;
    let ret = [];
    for (let i = 0; i < bagItems.length; i++) {
        let current = bagItems[i];
        ret.push(
            {
                // id:'rule-'+i,
                id: getGuid(),
                PicPath: current.PicPath,
                Count:current.Count,
                Name:current.Name,
                ItemId:current.ItemId,
                Price:current.Price
            }
        )
    }
    return ret;
}
//endregion

//region 方法:重新记录数组顺序
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    //删除并记录 删除元素
    const [removed] = result.splice(startIndex, 1);
    //将原来的元素添加进数组
    result.splice(endIndex, 0, removed);
    return result;
};
//endregion

//region  设置样式:获取给定参数的list内的元素的样式
const getItemStyle = (that, item, isDragging, draggableStyle) => {
    // console.log('获取样式:选择了吗?',item, '当前的选中的id是:', that.state)
    // console.log('是否一样?',item.id === that.state.selectedItemId)
    let isSelected = item.id === that.state.selectedItemId;
    let normal = {
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        userSelect:'none',
        cursor:'pointer',
        borderRadius:'5px',
        ...draggableStyle
    }
    let draggingInfo = {
        // background: isDragging ? "#ccd795" : "#edf6f3",
    }
    let selectedInfo;
    if (isSelected) {
        selectedInfo = {
            // border: '1px dashed #888666',
            // borderRadius: '5px',
        }
    } else {
        selectedInfo = {
            // border: '1px solid #ffffff',
            // borderRadius: '0px',
        }
    }
    return {
        ...normal,
        ...draggingInfo,
        // ...selectedInfo,
        // 拖拽的时候背景变化
    };
};
//endregion

//region 获取list外框的样式
const getListStyle = (snap) =>
{
    console.log('snap is :', snap)
    let style = {
        // background: '#eff5ef',
        // padding: grid,
        width: "100%",
        height:'600'
        // height:'100%'
    }
    if (snap.isDraggingOver)
    {
        // style.filter='blur(3px)';
        // style.color='gray';
        style.backgroundColor='red';
    }
    return style;
};
const getListClass = (snap)=>
{
    console.log('snap is :', snap)
    if (snap.isDraggingOver)
    {
        return classNames.columnTo;
    }
    else
    {
        return classNames.columnFrom;
    }
}
//endregion

//endregion


//region 控件定义的主体
export default class ItemsDND extends Component {
    //组件的数据
    state = {
        sourceBagPid:null,
        sourceItems: [],
        destItems:[],
        selectedItemId: null,
        showAddBtn: false,
    }

    //构造函数
    constructor(props) {
        super(props);
        let sourceItems = getItems3(this.props.sourceBag.Items?this.props.sourceBag.Items:[]);
        let bagId = this.props.sourceBag.Pid;
        this.state = {
            sourceItems: sourceItems,
            destItems:[],
            sourceBagPid:bagId,
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }
    componentWillReceiveProps(nextProps, nextContext) {
        // if (nextProps && nextProps.methods)
        // {
        //     let newItems = getItems3(nextProps.methods);
        //     this.setState({items:newItems,
        //     });
        // }
    }

    //region 响应事件集


    //当用户拖拽结束
    onDragEnd(result) {
        // console.log('拖拽结束,result',result);
        // dropped outside the list
        if (!result.destination)
        {
            return;
        }
        if (result.source.droppableId !== null && result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index)
        {
            console.log('在同一个列表中,未改变位置');
            return;
        }
        if (result.destination.droppableId === result.source.droppableId)
        {
            //如果在同一个表中拖拽排序
            const items = reorder(
                this.state.sourceItems,
                result.source.index,
                result.destination.index
            );
            this.setState({sourceItems:items},()=>
            {
                // if (this.props.onMateRuleMethodsChanged)
                // {
                //     this.props.onMateRuleMethodsChanged(convert2EnumIndexList(items));
                // }
            });
            console.log('在同一个表中 拖拽排序');
        }
        else if(result.destination.droppableId !== result.source.droppableId)
        {
            //在不同的表中拖拽改变位置
            console.log('在不同表中 拖拽改变内容');
            let fromList = [];
            let toList = [];
            if (result.destination.droppableId === srcBagItemsListName)
            {
                //往原包裹里面拽
                fromList = this.state.destItems;
                toList = this.state.sourceItems;
            }
            else if(result.destination.droppableId === destBagItemsListName)
            {
                //从原包裹里面拽到新包裹.
                fromList = this.state.sourceItems;
                toList = this.state.destItems;
            }
            //在原表中的位置
            let needMoveItem = fromList.splice(result.source.index,1);
            console.log('要移动的元素是:',needMoveItem);
            toList.splice(result.destination.index,0,needMoveItem[0]);
            this.setState({sourceItems:this.state.sourceItems,destItems:this.state.destItems});
        }
    }


    //当用户选择元素
    onSelected(item) {
        // console.log('点了选择', item.id)
        if (!item)
            return;
        // console.log(item);
        // let newValue = index;
        // if (this.state.selectedItemId === item.id)
        // {
        //     newValue = -1;
        // }
        if (this.state.selectedItemId === item.id) {
            this.setState({selectedItemId: null})
        } else {
            this.setState({selectedItemId: item.id})
        }
    }

    //当删除元素
    onClickRemoveBtn(index) {
        let data = this.state.items;
        data.splice(index, 1);
        if (data.length < 1) {
            Swal2.fire({
                title: '您至少需要添加一个该偏好设置的物流匹配方式,否则将按照无特殊规则的区域进行物流匹配',
                input: 'select',
                confirmButtonColor: '#7cd1f9',

                showCancelButton: false
            })
        }
        this.setState({items: data, showAddBtn: true},
            ()=>
            {
                if (this.props.onMateRuleMethodsChanged)
                {
                    this.props.onMateRuleMethodsChanged(convert2EnumIndexList(data));
                }
            });
    }

    //endregion


    //region 当用户点了添加按钮
    async onClickAddBtn() {
        //region 已经在使用的就不让选了.
        let canSelectItems = [];


        // console.log('已经有的:', this.state.items);
        //endregion

        //region 如果没有可以选的,退出,通常不会这样的,因为列表中如果已经包含了所有已经选择的,添加按钮就不显示了.
        if (!canSelectItems || canSelectItems.length === 0) {
            return;
        }
        //endregion
        //region 如果只有一项的话,直接添加这一项进来就可以了.

        if (canSelectItems.length === 1) {
            let data = this.state.items;
            data.push(
                {
                    // id:'item-'+data.length,
                    id: getGuid(),
                    content: canSelectItems[0],
                }
            )
            this.setState({items: data, showAddBtn: false},
                ()=>
                {
                    if (this.props.onMateRuleMethodsChanged)
                    {
                        this.props.onMateRuleMethodsChanged(convert2EnumIndexList(data));
                    }
                });
            return;
        }

        //endregion


        //region 使用sweetalert2进行展示选择
        const {value: selectedIndex} = await Swal2.fire({
            title: '请选择要添加的物流匹配规则',
            input: 'select',
            confirmButtonColor: '#7cd1f9',
            confirmButtonText:
                ' 添加',
            cancelButtonText:
                '取消',
            inputOptions: canSelectItems,
            inputPlaceholder: '',
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    // if (value === 'oranges') {
                    resolve()
                    // } else {
                    //     resolve('You need to select oranges :)')
                    // }
                })
            }
        })
        if (selectedIndex >= 0) {
            //选择有效的值,进行添加
            let selectedItem = canSelectItems[selectedIndex];
            if (selectedItem) {
                let newData = this.state.items;
                newData.push(
                    {
                        // id:'item-'+newData.length,
                        id: getGuid(),
                        content: canSelectItems[selectedIndex],
                    }
                )
                this.setState({items:newData},()=>
                {
                    if (this.props.onMateRuleMethodsChanged)
                    {
                        this.props.onMateRuleMethodsChanged(convert2EnumIndexList(newData));
                    }
                })
            }
        }
        //endregion
    }

    //endregion


    //region 渲染
    render() {
        return (
            <div className={classNames.main}>
                <div className={classNames.titleLine}>
                    <div className={classNames.titleStyle} style={{width:'50%',textAlign:'center'}}>原包裹商品列表</div>
                    <div className={classNames.titleStyle} style={{width:'50%',textAlign:'center'}}>新包裹商品列表</div>
                </div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div name={'总容器'} className={classNames.draggableLine}
                         onClick={(e)=>{e.stopPropagation()}}
                    >
                        <Droppable droppableId={srcBagItemsListName}>
                                {(provided, snapshot) => (
                                    <div
                                        //provided.droppableProps应用的相同元素.
                                        {...provided.droppableProps}
                                        // 为了使 droppable 能够正常工作必须 绑定到最高可能的DOM节点中provided.innerRef.
                                        ref={provided.innerRef}
                                        // style={getListStyle(snapshot)}
                                        className={getListClass(snapshot)}
                                        onMouseEnter={() => {
                                        }}
                                        onMouseLeave={() => {
                                            this.setState({showAddBtn: false})
                                        }}
                                    >

                                        {this.state.sourceItems && this.state.sourceItems.map((item, index) => {

                                                // console.log('当前选中的是:',this.state.selectedItemId);
                                                return  <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(this,
                                                                item,
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}
                                                            onClick={(e) => {
                                                                this.onSelected(item)
                                                            }}
                                                        >
                                                            <Item item={item}/>
                                                            {
                                                                <div hidden={!this.state.selectedItemId || this.state.selectedItemId !== item.id}
                                                                     onClick={() => {
                                                                         this.onClickRemoveBtn(index)
                                                                     }}><div className={classNames.deleteBtn}>删除</div></div>
                                                            }
                                                        </div>
                                                    )}
                                                </Draggable>
                                            }

                                        )}
                                        {/* 占位符号 */}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        <Droppable droppableId={destBagItemsListName}>
                                {(provided, snapshot) => (
                                    <div
                                        //provided.droppableProps应用的相同元素.
                                        {...provided.droppableProps}
                                        // 为了使 droppable 能够正常工作必须 绑定到最高可能的DOM节点中provided.innerRef.
                                        ref={provided.innerRef}
                                        // style={getListStyle(snapshot)}
                                        className={getListClass(snapshot)}
                                        onMouseEnter={() => {
                                        }}
                                        onMouseLeave={() => {
                                            this.setState({showAddBtn: false})
                                        }}
                                    >
                                        {this.state.destItems && this.state.destItems.map((item, index) => {

                                                // console.log('当前选中的是:',this.state.selectedItemId);
                                                return  <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(this,
                                                                item,
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}
                                                            onClick={(e) => {
                                                                this.onSelected(item)
                                                            }}
                                                        >
                                                            <Item item={item}/>
                                                            {
                                                                <div hidden={!this.state.selectedItemId || this.state.selectedItemId !== item.id}
                                                                     onClick={() => {
                                                                         this.onClickRemoveBtn(index)
                                                                     }}><div className={classNames.deleteBtn}>删除</div></div>
                                                            }
                                                        </div>
                                                    )}
                                                </Draggable>
                                            }

                                        )}
                                        {/* 占位符号 */}
                                        {provided.placeholder}
                                        {this.state.showAddBtn &&
                                        <div className={classNames.addBtn} onClick={this.onClickAddBtn.bind(this)}>＋</div>}
                                    </div>
                                )}
                            </Droppable>
                    </div>

                </DragDropContext>
            </div>

        );
    }

    //endregion
}
//endregion
