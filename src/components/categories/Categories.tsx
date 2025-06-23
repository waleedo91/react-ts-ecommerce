import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../api/fetchData";

function Categories() {
  const { data, isLoading, isError } = useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {data?.map((category, index: number) => (
          <li key={index}>{category}</li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
