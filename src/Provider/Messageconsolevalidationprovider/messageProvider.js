import { Alert,ToastAndroid ,Platform} from "react-native";
import Toast from 'react-native-simple-toast';
//--------------------------- Message Provider Start -----------------------
class messageFunctionsProviders {
        toast(message,position){
			if(position=='center')
			{
				Toast.showWithGravity(message, Toast.SHORT, Toast.CENTER);
		   }
			else if(position=='top')
			{
				Toast.showWithGravity(message, Toast.SHORT, Toast.TOP);
			}
			else if(position=='bottom')
			{
				Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);
				
			}
			else if(position=='long')
			{
				Toast.showWithGravity(message, Toast.LONG, Toast.CENTER);
		    }
			
		}
	 
	   alert(title, message, callback) {
		if(callback === false){
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.ok[0], 
					},
				],
				{cancelable: false},
			);
		}else{
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.ok[0], 
						onPress: () => callback,
					},
				],
				{cancelable: false},
			);
		}
		
       }

       confirm(title, message, callbackOk, callbackCancel) {
    	if(callbackCancel === false){
    		Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.cancel[0], 
					},
					{
						text: msgTitle.ok[0], 
						onPress: () =>  this.btnPageLoginCall(),
					},
				],
				{cancelable: false},
			);
    	}else{
    		Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.cancel[0], 
						onPress: () => callbackCancel,
					},
					{
						text: msgTitle.ok[0], 
						onPress: () => callbackOk,
					},
				],
				{cancelable: false},
			);
    	}
		
        }

      later(title, message, callbackOk, callbackCancel, callbackLater) {
		Alert.alert(
			title,
			message,
			[
				{
					text: 'Ask me later', 
					onPress: () => msgTitle.later[0],
				},
				{
					text: 'Cancel', 
					onPress: () => msgTitle.cancel[0],
				},
				{
					text: 'OK', 
					onPress: () => msgTitle.ok[0],
				},
			],
			{cancelable: false},
		);
	   }


}

//--------------------------- Title Provider Start -----------------------

class messageTitleProvider {
	//----------------- message buttons
	ok = ['Ok','Okay','Está bem' ];
	cancel = ['Cancel', 'Cancelar','Cancelar'];
	later = ['Later', 'Más tarde','Mais tarde'];

	//--------------- message title 
	information = ['Information Message','Mensaje informativo','Mensagem Informativa' ];
	alert = ['Alert','Alerta','Alerta' ];
	confirm = ['Information Message','Mensaje informativo','Mensagem Informativa' ];
	validation = ['Information Message', 'Mensaje informativo','Mensagem Informativa'];
	success = ['Information Message', 'Mensaje informativo','Mensagem Informativa'];
	error = ['Information Message', 'Mensaje informativo','Mensagem Informativa'];
	response = ['Response', 'Respuesta','Resposta'];
	server=['Connection Error','Error de conexión','Erro de conexão'];
	internet=['Connection Error','Error de conexión','Erro de conexão']
	deactivate_msg=['Account deactived']
	deactivate=[0,]
	usernotexit=["User id does not exist"]
	account_deactivate_title=['your account deactivated please try again']
}

//--------------------------- Message Provider Start -----------------------

class messageTextProvider {
	
	 loginFirst = ['Please login first', 'التحقق من صحة'];
	 emptyContactResion = ['Please select contact reason', 'التحقق من صحة'];
	 emptyContactMessage = ['Please enter message', 'التحقق من صحة'];
     networkconnection=['Unable to connect. Please check that you are connected to the Internet and try again.','Unable to connect. Please check that you are connected to the Internet and try again.'];
     servermessage=['An Unexpected error occured , Please try again .If the problem continues , Please do contact us','An Unexpected error occured , Please try again .If the problem continues , Please do contact us'];
     emptyEmail =['Please enter email address'];
	 validEmail =['Please enter valid email address'];
	 emptyPassword =['please Enter password'];
	 emptyPhone=['Please enter mobile number'];
	 validMobile=['Please enter valid mobile number'];
	 validMobileno=['Please enter minimum 7 or maximum 15 digit']
	 emptyAddress=['Please enter address'];
	 emptyName=['Please enter name'];
	 emptyMessage=['Please enter message'];
	 emptynewPassword=['Please enter new password'];
	 emptyconfirmPassword=['Please enter confirm password'];
	 emptyOldpassword=['Please enter old password'];
	 newmatchPassword = [' New Password or confirm password doesn'+"'"+'t match.' ];
	diffrentPassword = ['Old Password or New password should be diffrent.' ];
	

	emptyLocation=['Please enter location'];

	emptyDate=['Please select date '];
	

	emptyTime=['Please select time'];
	
	emptyImage=['Please select image'];
	emptyRemark=['Please enter remark'];

	emptypasswordsize=['Password should be atleast 6 digit','La contraseña debe tener al menos 6 dígitos'];
	
	emptyStarttime=['Please select start time','Por favor seleccione hora de inicio'];
	emptyEndtime=['Please select end time','Por favor seleccione hora de finalización'];

	emptyComment=['Please enter comment','Por favor ingrese un comentario'];
	emptyServicerate=['please enter service rate','por favor ingrese la tarifa del servicio'];
	
	emptylastName=['Please enter last name','Please enter last name']
	emptySpace=['Please do not enter space','Por favor no ingrese al espacio'];
	emptyUsername=['Please enter username','Por favor ingrese el nombre de usuario'];
	emptyAge=['Please enter age','Por favor ingrese la edad'];
	emptyTemp=['Please enter temperature','Por favor ingrese la temperatura'];
	
	emptyChipid=['Please enter chipid','Por favor ingrese chipid'];
	emptydevicetype=['Please choose typeof','Por favor elija el tipo de'];
	emptyDevice_name=['Please enter device name','Ingrese el nombre del dispositivo'];
	emptyRegactual=['Please enter regactual','Por favor ingrese actual'];
	emptyReactual_two=['Please enter regactual two','Por favor ingrese el actual dos'];
	emptyDescription=['Please enter description','Por favor ingrese una descripción'];
	emptyStarttime=['Please enter start time','Ingrese la hora de inicio'];
	emptyEndtime=['Please enter end time','Ingrese la hora de finalización'];
	emptyValidAge=['Please enter valid age','Ingrese una edad válida'];
	ValidView=['If you select add,edit,delete then view is compulsory','Si selecciona agregar, editar, eliminar, la vista es obligatoria']

}

export const msgText = new messageTextProvider();
export const msgTitle = new messageTitleProvider();
export const msgProvider = new messageFunctionsProviders();
//--------------------------- Message Provider End -----------------------