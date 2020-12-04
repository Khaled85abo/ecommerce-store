import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Row, Col} from 'react-bootstrap';
import Product from '../components/Product'
import Message from '../components/Message'
import Laoder from '../components/Loader'
import {listProducts} from '../actions/productActions'



const HomeScreen = () => {
        const dispatch = useDispatch()

        const productList = useSelector(state => state.productList)
        const {loading, error, products} = productList

    useEffect( () => {
        dispatch(listProducts())

    }, [dispatch])


    return (
        <>
        <h1>Latest Products</h1>
        {loading ?
        <Laoder /> :
        error ?
        <Message variant='danger' >{error}</Message>  :         
        <Row>
            {products.map(product => (
                <Col key={product._id} sm={12} md={6} lg={4}>
                <Product product = {product}/>
                </Col>
            ))}
        </Row>
        }
            
        </>
    )
}

export default HomeScreen