import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../api/fetchData";
import { NavDropdown } from "react-bootstrap";

function Categories() {
  const { data, isLoading, isError } = useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div>
      {data?.map((category, index: number) => (
        <NavDropdown.Item
          as={Link}
          to={`/products/category/${category}`}
          key={index}
        >
          {category}
        </NavDropdown.Item>
      ))}
    </div>
  );
}

export default Categories;
