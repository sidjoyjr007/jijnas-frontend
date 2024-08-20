import { useLocation, Link } from "react-router-dom";

const BreadCrum = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const labels = pathnames?.map((item, index) => {
    return { label: item, path: `/${pathnames.slice(0, index + 1).join("/")}` };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol role="list" className="flex items-center space-x-4">
        {labels.map((page, index) => (
          <li key={page?.path}>
            <div className="flex items-center">
              {index !== 0 && (
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-gray-400 hover:text-gray-200 cursor-pointer"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
              )}
              {index === labels?.length - 1 ? (
                <div
                  className="
                  ml-4
                  text-sm
                  font-medium
                  text-gray-200
                  hover:text-gray-200"
                >
                  {page?.label}
                </div>
              ) : (
                <Link
                  to={page?.path}
                  className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200 cursor-pointer"
                >
                  {page?.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrum;
