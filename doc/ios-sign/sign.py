import sys
import uuid
import base64
import configparser
from xml.etree import ElementTree as ET
import xml.dom.minidom
import textwrap

def generate_mobileconfig(app_name, url, icon_data):
    # 生成随机的PayloadDisplayName和PayloadIdentifier
    payload_display_name = app_name
    payload_identifier = str(uuid.uuid4())

    # 创建根元素
    root = ET.Element("plist", version="1.0")

    # 添加根元素
    plist_element = ET.SubElement(root, "dict")

    # 添加PayloadContent
    ET.SubElement(plist_element, "key").text = "PayloadContent"
    payload_content_array = ET.SubElement(plist_element, "array")
    payload_dict = ET.SubElement(payload_content_array, "dict")

    ET.SubElement(payload_dict, "key").text = "FullScreen"
    ET.SubElement(payload_dict, "true")

    ET.SubElement(payload_dict, "key").text = "Icon"

    # Wrap base64 data every 76 characters
    wrapped_icon_data = textwrap.fill(icon_data, width=76)
    ET.SubElement(payload_dict, "data").text = wrapped_icon_data

    ET.SubElement(payload_dict, "key").text = "IsRemovable"
    ET.SubElement(payload_dict, "true")

    ET.SubElement(payload_dict, "key").text = "Label"
    ET.SubElement(payload_dict, "string").text = app_name

    ET.SubElement(payload_dict, "key").text = "PayloadDescription"
    ET.SubElement(payload_dict, "string").text = "配置 Web Clip 设置"

    ET.SubElement(payload_dict, "key").text = "PayloadDisplayName"
    ET.SubElement(payload_dict, "string").text = "Web Clip"

    ET.SubElement(payload_dict, "key").text = "PayloadIdentifier"
    ET.SubElement(payload_dict, "string").text = "com.apple.webClip.managed." + payload_identifier

    ET.SubElement(payload_dict, "key").text = "PayloadType"
    ET.SubElement(payload_dict, "string").text = "com.apple.webClip.managed"

    payload_uuid = str(uuid.uuid4())
    ET.SubElement(payload_dict, "key").text = "PayloadUUID"
    ET.SubElement(payload_dict, "string").text = payload_uuid

    ET.SubElement(payload_dict, "key").text = "PayloadVersion"
    ET.SubElement(payload_dict, "integer").text = "1"

    ET.SubElement(payload_dict, "key").text = "Precomposed"
    ET.SubElement(payload_dict, "false")

    ET.SubElement(payload_dict, "key").text = "URL"
    ET.SubElement(payload_dict, "string").text = url

    # 添加PayloadDescription
    ET.SubElement(plist_element, "key").text = "PayloadDescription"
    ET.SubElement(plist_element, "string").text = "请点击右上角的“安装”按钮，红色标志请忽略。该安装会在您的手机桌面上添加一个应用的入口，可能需要输入密码后才能完成安装！"

    # 添加PayloadOrganization
    ET.SubElement(plist_element, "key").text = "PayloadOrganization"
    ET.SubElement(plist_element, "string").text = ""

    # 添加PayloadRemovalDisallowed
    ET.SubElement(plist_element, "key").text = "PayloadRemovalDisallowed"
    ET.SubElement(plist_element, "false")

    # 添加其他配置信息
    ET.SubElement(plist_element, "key").text = "PayloadDisplayName"
    ET.SubElement(plist_element, "string").text = app_name

    ET.SubElement(plist_element, "key").text = "PayloadIdentifier"
    ET.SubElement(plist_element, "string").text = payload_identifier

    ET.SubElement(plist_element, "key").text = "PayloadType"
    ET.SubElement(plist_element, "string").text = "Configuration"

    payload_uuid_2 = str(uuid.uuid4())
    ET.SubElement(plist_element, "key").text = "PayloadUUID"
    ET.SubElement(plist_element, "string").text = payload_uuid_2

    ET.SubElement(plist_element, "key").text = "PayloadVersion"
    ET.SubElement(plist_element, "integer").text = "1"

    # 将XML数据转换为字符串
    xml_data = ET.tostring(root, encoding="utf-8").decode()

    # 添加DOCTYPE声明
    doctype_declaration = '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">'
    xml_data_with_doctype = doctype_declaration + '\n' + xml_data

    # 使用minidom进行XML格式化
    dom = xml.dom.minidom.parseString(xml_data_with_doctype)
    pretty_xml_data = dom.toprettyxml(indent="    ")

    # 保存为.mobileconfig文件
    with open("GeneratedProfile.mobileconfig", "w", encoding='utf-8') as file:
        file.write(pretty_xml_data)


if __name__ == "__main__":
    # 从配置文件中读取参数
    config_file = "config.ini"  # 替换为你的配置文件路径
    config = configparser.ConfigParser()
    config.read(config_file, encoding='utf-8')

    app_name = config.get("AppConfig", "app_name")
    url = config.get("AppConfig", "url")
    icon_file_path = config.get("AppConfig", "icon_file_path")

    # 读取图标文件并转换为base64编码
    with open(icon_file_path, "rb") as icon_file:
        icon_data = base64.b64encode(icon_file.read()).decode()

    # 生成.mobileconfig文件
    generate_mobileconfig(app_name, url, icon_data)

    print("MobileConfig文件已生成：GeneratedProfile.mobileconfig")
