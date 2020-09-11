import React, {useRef, useState} from "react";
import {TouchableOpacity} from "react-native";
import Menu, {MenuItem, MenuDivider} from "react-native-material-menu";
import Icon from "react-native-vector-icons/FontAwesome5";
import styles from "./styles";
import {useDeleteFootprintMutation} from "../../generated/graphql";
import {DeletionConfirmationDialog} from "../../components/modals/";

interface MoreMenuProps {
  /** Se il footprint appartiene all'utente loggato */
  own?: boolean;
  /** ID del footprint  */
  footprintId: string;
}
export const MoreMenu: React.FC<MoreMenuProps> = ({own, footprintId}) => {
  // se il popup per confermare l'eliminazione del footprint è aperto
  const [isDelteModalOpen, setIsDelteModalOpen] = useState(false);

  const menuRef = useRef<Menu | null>(null);
  // grapqh
  const [runDeleteFootprintMutation] = useDeleteFootprintMutation();

  /**
   * Nasconde il menu
   */
  const hideMenu = () => {
    if (!menuRef.current) return;
    menuRef.current.hide();
  };

  /**
   * Mostra il menu
   */
  const showMenu = () => {
    if (!menuRef.current) return;
    menuRef.current.show();
  };

  /**
   * Elimina il footprint
   * @todo
   */
  const deleteFootprint = async () => {
    const {data, errors} = await runDeleteFootprintMutation({
      variables: {id: footprintId},
      // Rimuove il footprint appena eliminato dal feed
      update: (proxy) => {
        try {
          /*        const newData = (data.getNewsFeed as NewsFeedItem[]).filter(
            (item) => item.footprint.id !== footprintId,
          );

          data.getNewsFeed = {...data.getNewsFeed, ...newData};
          proxy.writeQuery({query: GetNewsFeedDocument, data}); */
        } catch (error) {
          console.log(error);
        }
      },
    });
    if (!data || !data.deleteFootprint.success || errors) throw new Error();
  };

  /**
   * Funzione chiamata al click della bottone per elimina il footprint
   */
  const handleDeleteButtonPress = () => {
    // Chiude il menu
    hideMenu();
    // Mostra il modal
    setIsDelteModalOpen(true);
  };

  /**
   * Condividi il footprint
   * @todo
   */
  const share = () => {};

  return (
    <>
      <DeletionConfirmationDialog
        isOpen={isDelteModalOpen}
        setIsOpen={setIsDelteModalOpen}
        deleteContent={deleteFootprint}
        text="Hai veramente intenzione di eliminare questo footprint?"
      />
      <Menu
        ref={menuRef}
        button={
          <TouchableOpacity onPress={showMenu} style={styles.headerButton}>
            <Icon name="ellipsis-v" color="#eee" size={20} />
          </TouchableOpacity>
        }>
        <MenuItem onPress={share}>Condividi</MenuItem>
        {own && (
          <>
            <MenuDivider />
            <MenuItem onPress={handleDeleteButtonPress}>Elimina</MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};
