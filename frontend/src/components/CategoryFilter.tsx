import './CategoryFilter.css';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="category-filter">
      <button className={`category-button ${selectedCategory === null ? 'active' : ''}`} onClick={() => onSelectCategory(null)}>
        All Products
      </button>
      {categories.map((category) => (
        <button key={category} className={`category-button ${selectedCategory === category ? 'active' : ''}`} onClick={() => onSelectCategory(category)}>
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
