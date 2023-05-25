import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
// import * as Actions from ".././controller/ActionTypes";
import { Heart, Repeat, Eye, ShoppingCart } from 'react-feather';
import 'toastr/build/toastr.min.css';
import toastrs from "toastr";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import product3 from '../../../asset/images/products/product03.png'

const ProductIndex = (product) => {
    //const dispatch = useDispatch();
    const url = 'http://localhost:8080/api/carts';
    const notifySuccess=(message)=>{
        toast.success(message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    const [carts, setData] = useState({
        productId:null,
        quantity:null,
        total:null,
        userId:null
        }
      );
    const clickThemVaoMyCart=(data)=>{
        console.log(data);
        setData({
            productId:data.id,
            quantity:1,
            total:data.price,
            userId:1
        })
        
    };
    const handleAdd=()=>{
        console.log(carts);
        axios.post(url,carts)
        .then(res => {
          notifySuccess('Thêm vào giỏ hàng thành công!')
          console.log(res.data);
        })
    }
    useEffect(() => {
        handleAdd();
      }, [carts]);

    const loadImage = () => {
    if(product.product.images!=null){
        product.product.images.map((image, index) => {
        console.log("img",image.name)
        return (
            <div key={index}>
              <h2>name: {image.name}</h2>
            </div>
          );
        })}
    }
    const getImage=(nameImage)=>{
         
    }

    // const clickThemVaoMyCart = (e) => {
    //     dispatch({
    //         type: Actions.UPDATE_CART,
    //         ttype: 'add_cart',
    //         data: {
    //             id: product.product.id,
    //         }
    //     })
    // };
    return(
        
        <div class="product">
            <ToastContainer />
            <div class="product-img">
            <p>{product.product.images!=null?
                    product.product.images.map((image, index) => {
                    console.log("img",image.name)
                    return (
                        <div class="product-img" key={index}>
                        <img src={product3} alt="" />
                        </div>
                    );
                    }):""}</p>
                <div class="product-label">
                    <span class="sale">-30%</span>
                    <span class="new">NEW</span>
                </div>
            </div>
            <div class="product-body">
                <p class="product-category">{product.product.images!=null?
                    product.product.images.map((image, index) => {
                    console.log("img",image.name)
                    return (
                        <div key={index}>
                        <p>{image.name}</p>
                        </div>
                    );
                    }):""}</p>
                <h3 class="product-name"><a href="#">{product.product.name}</a></h3>
                <h4 class="product-price">${product.product.price} <div></div> <del class="product-old-price">$990.00</del></h4>
            </div>
            <div class="add-to-cart">
                <button onClick={()=>clickThemVaoMyCart(product.product)} class="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button>
                {/* <button onClick={clickThemVaoMyCart} class="add-to-cart-btn"><ShoppingCart size={18}></ShoppingCart> add to cart</button> */}
            </div>
        </div>
    )
}
export default ProductIndex;