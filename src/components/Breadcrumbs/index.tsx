"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import Link from "next/link";
export const Breadcrumbs = () => {
  const path = usePathname();
  const paths = path === "/" ? [] : path.split("/").slice(1);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home size={16} />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {paths.slice(0, 2).map((item, index) => {
          return (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index !== paths.length - 1 ? (
                  <Link href={`/${paths.slice(0, index + 1).join("/")}`}>
                    {`${paths.slice(index, index + 1)}`}
                  </Link>
                ) : (
                  <BreadcrumbPage>{item}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
