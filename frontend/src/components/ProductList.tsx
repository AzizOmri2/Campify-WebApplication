import ProductCard from './ProductCard';
import './ProductList.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


interface ProductType {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

interface ProductListProps {
  products: ProductType[];
}


const ProductList = ({ products }: ProductListProps) => (
  <TransitionGroup className="product-list">
    {products.map((product, idx) => (
      <CSSTransition key={product._id} timeout={800} classNames="product-fade">
        <div style={{ '--index': idx } as React.CSSProperties}>
          <ProductCard product={product} />
        </div>
      </CSSTransition>
    ))}
  </TransitionGroup>
);

export default ProductList;
