# Copyright (c) 2025, ahmedatef and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class FeatureRequest(Document):
	def autoname(self):
		self.name = self.title
