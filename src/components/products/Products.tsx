import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../api/fetchData";
import { type Product } from "../../types/types";
// TODO: Update the product component to a card for each product with required information for the Products List Page.

const Products = () => {
  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <p>Loading Products....</p>;
  if (isError) return <p>No Products found</p>;

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {data?.map((product) => (
          <li key={product.id}>
            <h3>{product.title}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
