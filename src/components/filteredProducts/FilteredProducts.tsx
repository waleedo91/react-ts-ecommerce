import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, Container, Row, Col } from "react-bootstrap";
import { fetchProductByCategory } from "../../api/fetchData";
import { type Product } from "../../types/types";

const FilteredProducts = () => {
  const { categoryName } = useParams();

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", categoryName],
    queryFn: () => {
      if (!categoryName) throw new Error("Category is undefined");
      return fetchProductByCategory(categoryName);
    },
    enabled: !!categoryName,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;

  return (
    <Container>
      <h2 className="mb-4 text-capitalize">{categoryName} Products</h2>
      <Row>
        {products.map((product: Product) => (
          <Col key={product.id} md={6} lg={4}>
            <Card className="mb-4">
              <Card.Img
                variant="top"
                src={product.image}
                style={{ height: "200px", objectFit: "contain" }}
              />
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>${product.price}</Card.Text>
                {/* Link to single product or add to cart button here */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FilteredProducts;
