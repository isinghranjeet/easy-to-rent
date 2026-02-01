// import React from "react";
// import { Link, LinkProps, useMatch, useResolvedPath } from "react-router-dom";

// interface NavLinkProps extends LinkProps {
//   children: React.ReactNode;
//   className?: string;
//   activeClassName?: string;
//   inactiveClassName?: string;
// }

// export function NavLink({
//   children,
//   to,
//   className = "",
//   activeClassName = "bg-orange-500 text-white",
//   inactiveClassName = "text-gray-700 hover:bg-orange-100 hover:text-orange-600",
//   ...props
// }: NavLinkProps) {
//   const resolved = useResolvedPath(to);
//   const match = useMatch({ path: resolved.pathname, end: true });

//   return (
//     <Link
//       to={to}
//       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//         match ? activeClassName : inactiveClassName
//       } ${className}`}
//       {...props}
//     >
//       {children}
//     </Link>
//   );
// }