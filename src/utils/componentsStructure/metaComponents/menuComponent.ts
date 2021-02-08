const MenuComponent = {
  Menu: `<Menu isOpen>
    <MenuButton>
      <Button>Button text</Button>
    </MenuButton>
    <MenuList>
    <MenuItem>Download</MenuItem>
    <MenuItem>Create a Copy</MenuItem>
    <MenuItem>Mark as Draft</MenuItem>
    <MenuItem>Delete</MenuItem>
    <MenuItem>Attend a Workshop</MenuItem>
  </MenuList>
    </Menu>`,
  MenuItem: ` <MenuItem>
<Text>Text value</Text>
</MenuItem>`,
  MenuButton: ` <MenuButton>
<Button>Button text</Button>
</MenuButton>`,
  MenuList: ` <MenuList>
<MenuItem>
  <Text>Text value</Text>
</MenuItem>
<MenuItem>
  <Text>Text value</Text>
</MenuItem>
</MenuList>`,
}

export default MenuComponent
