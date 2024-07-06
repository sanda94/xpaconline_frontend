import SingleDevice from "../../components/SingleDevice/SingleDevice";
import "./product.scss";
import { useParams } from "react-router-dom";

const Product = () => {
  const params = useParams();
  console.log(params);

  return (
    <div className="product">
      <SingleDevice />
    </div>
  );
};

export default Product;
