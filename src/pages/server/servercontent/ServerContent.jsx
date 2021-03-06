import React, { memo,useState,useRef,useEffect } from 'react';
import {connect} from 'react-redux';
import ContentCompont from './contentcomponent/ContentCompoent';
import * as FunActionTypes from '../store/actionCreators'
import  './servercontent.css';
import { withRouter } from 'react-router-dom';
function  ServerContentHSS (props) {
    const {serverdata}=props
    const [activeIndex,setActiveIndex]=useState(0);

    //监听函数点事件
    const handleTabClick=(e)=>{

    
        const  activeIndex=e.target.getAttribute("data-index")
        setActiveIndex(parseInt(activeIndex))
        const ltab=e.target.getAttribute("data-lefttab")
        const rtab=document.querySelector(`[data-righttab="${ltab}"]`)
        
        rtab.scrollIntoView({
          behavior:'smooth'
        })
    }

    let ranges=[];
    const ref=useRef();
    let base=0;
    //数据初始化

    const initdata=()=>{
        if(!serverdata.length){
            // console.log("第一次进入");
            props.getServerLeftRightData();
        }
    }
    const initScroll=()=>{
        const tabDetail=ref.current;
        // console.log("tabDetail",tabDetail)
        const tabs=tabDetail.querySelectorAll(`[data-righttab]`)
        // console.log("tabs",tabs)

        for(let tab of tabs){
        let h=tab.getBoundingClientRect().height;
        let newH=base+h;
        // console.log("数据",[base,newH])
        ranges.push([base,newH])
        base=newH;
        }

    function onScroll(e){
        const scrollTop=tabDetail.scrollTop;
        const index = ranges.findIndex(range=>scrollTop>=range[0]&&scrollTop<range[1])
        // console.log("高度",index,scrollTop,ranges)

        setActiveIndex(index)

    }
    tabDetail.addEventListener('touchstart',()=>{
        tabDetail.addEventListener('touchmove',onScroll)

    })

    tabDetail.addEventListener('touchend',()=>{
        tabDetail.removeEventListener('touchmove',onScroll);

    })
    }
    //effect 将在每轮渲染结束后执行
    useEffect( ()=>{
        initdata();
        // setTimeout(()=>{
            initScroll();
        // },500)
     
    },[serverdata])
   
    const handleclick = (id) => {
        // console.log("object",encodeURIComponent(id))
        // this.props.history.push(`/detail/${id}`)


        props.history.push(`/detail?data=${encodeURIComponent(id)}`)
        // console.log(this.props)
    }
        return ( 
            <div className="server">
                <div className="left">
                    <ul >
                        {
                            !serverdata?"":
                            serverdata.map((item,index)=>{
                                return (
                                        <li key={index}
                                        data-index={index}
                                        data-lefttab={item.title}
                                        onClick={handleTabClick}
                                        className={activeIndex===index?"active":""}
                                        >
                                            <span 
                                             data-index={index}
                                             data-lefttab={item.title}>
                                                {item.title}
                                            </span>                                         
                                        </li>
                                )                              
                            })
                        }
                    </ul>
                </div>
                <div className="right"   ref={ref} >
                <ul>
                    {/* <Scroll>

                    </Scroll> */}
                    {
                        !serverdata?"":
                        serverdata.map((item,index)=>{
                            return (
                                <li key={index}
                                    data-righttab={item.title}
                                    onClick={()=>{handleclick(item.title)}}
                                    >
                                    <img src={item.imgUrl} alt="" className="right-top__img"/>
                                    <span>
                                        <ContentCompont content={item.data}/>
                                    </span>
                                </li>
                            )                              
                        })
                    }
                    </ul>
                </div>
            </div>
        );
    }
// }
 
function mapStateToProps(state){
    return {
        serverdata:state.server.serverLeftRightdata
    }

}
function mapDispatchToProps(dispatch){
    return{
        getServerLeftRightData(){
            dispatch(FunActionTypes.getServerLeftRightData())
        }

    }

}

export default connect(mapStateToProps,mapDispatchToProps)(memo(withRouter(ServerContentHSS)));