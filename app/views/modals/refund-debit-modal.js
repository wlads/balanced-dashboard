import Ember from "ember";
import ModalBaseView from "./modal-base";
import Form from "balanced-dashboard/views/modals/mixins/form-modal-mixin";
import Full from "balanced-dashboard/views/modals/mixins/full-modal-mixin";
import RefundDebitTransactionFactory from "balanced-dashboard/models/factories/refund-debit-transaction-factory";

var RefundDebitModalView = ModalBaseView.extend(Full, Form, {
	templateName: 'modals/refund-debit-modal',
	elementId: "refund-debit",
	title: function() {
		return "Refund this %@".fmt(this.get("recipient"));
	}.property("recipient"),
	cancelButtonText: "Cancel",
	submitButtonText: "Refund",

	recipient: Ember.computed.oneWay("debit.recipient"),
	recipientLabel: function() {
		return this.get("recipient").capitalize();
	}.property("recipient"),

	recipientDisplay: Ember.computed.oneWay("debit.recipient_name"),

	model: function() {
		return RefundDebitTransactionFactory.create({
			dollar_amount: this.get("debit.dollar_amount"),
			debit: this.get("debit")
		});
	}.property("debit"),

	isSaving: false,

	actions: {
		save: function() {
			var self = this;
			this.set("isSaving", true);
			this.get("model")
				.save()
				.then(function(model) {
					self.set("isSaving", false);
					self.get("controller").transitionToRoute(model.get("route_name"), model);
					self.close();
				}, function(errors) {
					self.set("isSaving", false);
				});
		},
	}
});

RefundDebitModalView.reopenClass({
	open: function(debit) {
		return this.create({
			debit: debit
		});
	}
});

export default RefundDebitModalView;
