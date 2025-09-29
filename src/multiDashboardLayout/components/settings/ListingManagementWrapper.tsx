import React from "react";
import { useParams } from "react-router-dom";
import { ListingProvider } from "@/context/ListingContext"; // ADD THIS IMPORT
import { ListingManagementPage } from "@/components/Settings/ListingManagementPage";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ListingManagementWrapper: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { t } = useI18nNamespace(
    "MultidashboardComponent/listingManagementWrapper"
  );

  if (!accountId) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">{t("accountIdRequired")}</p>
        </div>
      </div>
    );
  }

  return (
    <ListingProvider>
      <div className="p-6">
        <div className="[&>div]:!p-0 [&>div]:!max-w-none [&>div]:!mx-0">
          <ListingManagementPage accountId={accountId} />
        </div>
      </div>
    </ListingProvider>
  );
};
